import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {MatDialogModule,MatDialogRef} from '@angular/material/dialog';
import { DialogService } from '../service/dialog.service';
import { ApiCallService } from '../service/api-call.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ApiCallMockService } from '../service/api-call-mock.service';


fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let el : HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        HttpClientModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide : ApiCallService, useClass: ApiCallMockService}
        , {provide : MatDialogRef, useValue : {}}, {provide : Router, useValue : {}}]
      // providers: [DialogService, MatDialogRef, MatDialogModule]
    })
    .compileComponents();



    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check loginSection value to be true',async(()=>{
    // setTimeout(() => {
    //   expect(component.loginSection).not.toBe(false);
    //   console.log('test1');
    // }, 3000);
    
    expect(component.loginSection).toBeTruthy();
  }));
  it("should not call the onLoginClick()", (()=>{
    spyOn(component, 'onLoginClick');
    el= fixture.debugElement.query(By.css('.login-right-part11')).nativeElement;
    el.click();
    expect(component.onLoginClick).toHaveBeenCalledTimes(1);
  }));

  it("form should be invalid", async(()=>{
    expect(component.loginForm.valid).toBeFalsy();
  }));

  it('form should be valid', async(()=>{
    component.loginForm.controls['user_login'].setValue('9999999999');
    component.loginForm.controls['user_password'].patchValue("test12345");
    expect(component.loginForm.valid).toBeTruthy();
  }));

  it('should have one product', async(()=>{
    expect(component.product.length).toEqual(1);
  }));
});
